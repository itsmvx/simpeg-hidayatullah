import { Bounce, toast } from "react-toastify";

export const generateRandomPassword = (length = 12): string => {
    const symbols = "!@#$%^&*_-.";
    const numbers = "0123456789";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const allChars = symbols + numbers + lowercase + uppercase;
    let newPassword = "";

    newPassword += symbols.charAt(Math.floor(Math.random() * symbols.length));
    newPassword += numbers.charAt(Math.floor(Math.random() * numbers.length));
    newPassword += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    newPassword += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    for (let i = newPassword.length; i < length; i++) {
        newPassword += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    return newPassword.split('').sort(() => 0.5 - Math.random()).join('');
};

export const notifyToast = (type: 'success' | 'error', message: string, theme: 'light' | 'dark' = 'light') => {
    toast[type](message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: theme,
        transition: Bounce,
    });
};

export const excelDateToJSDate = (excelDate: number): Date => {
    return new Date((excelDate - 25569) * 86400 * 1000);
};
export const calculateAge = (birthDate: Date) => {
    const now = new Date();
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    return { years, months };
};
