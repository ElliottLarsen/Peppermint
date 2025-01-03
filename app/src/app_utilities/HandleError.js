export const handleError = (error, navigate) => {
    console.error(error);
    if (error.response?.status === 401) {
        navigate('/login');
    } else {
        alert(error.response?.data?.message || 'An unexpected error has occurred.');
    }
};