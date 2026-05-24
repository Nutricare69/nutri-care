export const calculateAge = (dob) =>{
    const today = Date.now();
    const todayDate = new Date(today);
    const birthDate = new Date(dob);

    let age = todayDate.getFullYear() - birthDate.getFullYear();

    const month = todayDate.getMonth() - birthDate.getMonth();

    if(month < 0 || (month === 0 && todayDate.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}