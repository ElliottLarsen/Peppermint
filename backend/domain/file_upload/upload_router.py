from sqlalchemy.orm import Session
from fastapi import (
    FastAPI,
    Depends, 
    File, 
    UploadFile, 
    APIRouter, 
    HTTPException,
    )
from io import StringIO
from starlette import status
from datetime import datetime
import csv, json
from database import get_db
from domain.transaction.transaction_crud import (
    create_transaction,
)
from domain.transaction.transaction_schema import (
    TransactionCreate,
)

router = APIRouter(prefix="/peppermint")

date_format = "%m/%d/%Y"

@router.post("/upload/{account_id}")
async def upload_file(
    account_id: str,
    query: str,
    db: Session = Depends(get_db),
    file: UploadFile = File(...),
      ):
    """
    Upload bank statement to add to transactions
    
    :param file: Description
    :type file: UploadFile
    """
    # require csv check type (and extension?)
    if file.content_type != "text/csv":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File type not supported (upload a CSV file)",
        )

    contents = await file.read()
    buffer = StringIO(contents.decode("utf-8"))

    transactions = []
    if query == "boa":
        transactions = read_boa_file(buffer)
    if query == "disco":
        transactions = read_disco_file(buffer)

    for entry in transactions:
        create_transaction(db=db, transaction_create=entry, account_id=account_id)

def convert_digit_string(num) -> float:
    amount = []
    for c in num:
        if c.isdigit() or c == '.' or c == "-":
            amount.append(c)
    return float("".join(amount))

def read_boa_file(reader):
    transactions = []
    for row in reader:
        if len(row) > 3 and row[0][0].isdigit():
            if "Beginning balance" in row[1]:
                continue
            date = datetime.strptime(row[0], date_format).date() if row[0] else date.today()
            description = row[1] if row[1] else ""
            category = ""
            amount = (convert_digit_string(row[2])) if row[2] else 0.00
            # row_transaction = {
            #     'transaction_date': date, 
            #     'transaction_description':description, 
            #     'transaction_category':category, 
            #     'transaction_amount':amount
            # }
            row_transaction = TransactionCreate(
                transaction_date=date,
                transaction_description=description.lstrip('"').rstrip('"'),
                transaction_category=category,
                transaction_amount=amount
                )
            transactions.append(row_transaction)
    return transactions

def read_disco_file(reader):
    transactions = []
    for r in reader:
        row = r.split(',')
        if row[0][0].isdigit():
            date = datetime.strptime(row[0], date_format).date() if row[0] else date.today()
            description = row[2] if row[2] else ""
            category = row[4] if row[4] else ""
            # disco has positive values for debits
            amount = (convert_digit_string(row[3])) if row[3] else 0.00
            amount *= -1

            row_transaction = TransactionCreate(
                transaction_date=date,
                transaction_description=description.lstrip('"').rstrip('"'),
                transaction_category=category.lstrip('"').rstrip('"\r\n'),
                transaction_amount=amount
                )
            transactions.append(row_transaction)

    return transactions

