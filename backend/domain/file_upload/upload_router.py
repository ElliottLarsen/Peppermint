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
import csv
from database import get_db
from domain.transaction.transaction_crud import (
    create_transaction,
)

router = APIRouter(prefix="/peppermint")

@router.post("/upload")
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
    if not file.content_type != "text/csv":
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
        try:
            if len(row) > 3 and row[0][0].isdigit():
                if "Beginning balance" in row[1]:
                    continue
                date = row[0] if row[0] else ""
                description = row[1] if row[1] else ""
                category = ""

                amount = (convert_digit_string(row[2])) if row[2] else 0.00
                row_transaction = {
                    'transaction_date': date, 
                    'transaction_description':description, 
                    'transaction_category':category, 
                    'transaction_amount':amount
                }
                transactions.append(row_transaction)
        except:
            raise BaseException
    return transactions

def read_disco_file(reader):
    transactions = []
    for row in reader:
        if row[0][0].isdigit():
            date = row[0] if row[0] else ""
            description = row[2] if row[2] else ""
            category = row[4] if row[4] else ""
            # disco has positive values for debits
            amount = (convert_digit_string(row[3])) if row[3] else 0.00
            amount *= -1
            row_transaction = {
                'transaction_date': date, 
                'transaction_description':description, 
                'transaction_category':category, 
                'transaction_amount':amount
            }
            transactions.append(row_transaction)

    return transactions

