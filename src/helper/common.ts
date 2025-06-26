// export const CurrentTime = (): string => {
//   const systemTime = new Date();

//   const options: Intl.DateTimeFormatOptions = {
//     day: "numeric",
//     month: "numeric",
//     year: "numeric",
//     hour: "numeric",
//     minute: "numeric",
//     second: "numeric",
//     hour12: true,
//   };
//   return new Intl.DateTimeFormat("en-IN", options).format(systemTime);
// };

// export const CurrentTime = (): string => {
//   const now = new Date();

//   // Get IST offset (in minutes)
//   const istOffset = 330; // IST is UTC+5:30 => 5*60 + 30 = 330

//   // Convert current time to IST
//   const istTime = new Date(now.getTime() + istOffset * 60000 - now.getTimezoneOffset() * 60000);

//   // Format to YYYY-MM-DD HH:mm:ss
//   const year = istTime.getFullYear();
//   const month = String(istTime.getMonth() + 1).padStart(2, '0');
//   const day = String(istTime.getDate()).padStart(2, '0');
//   const hours = String(istTime.getHours()).padStart(2, '0');
//   const minutes = String(istTime.getMinutes()).padStart(2, '0');
//   const seconds = String(istTime.getSeconds()).padStart(2, '0');

//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// };

export const CurrentTime = () => {
  const today = new Date();
  return today;
};
// export const CurrentTime = (): string => {
//   const today = new Date();
//   return today.toISOString().replace("T", " ").slice(0, 19); // "YYYY-MM-DD HH:mm:ss"
// };

export function generateFileName(): string {
  // Generate a random string of 6 alphabets
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@$*";
  const randomChars = Array.from({ length: 6 }, () =>
    alphabets.charAt(Math.floor(Math.random() * alphabets.length))
  ).join("");

  // Get current date in DDMMYYYY format
  const today = new Date();
  const datePart = `${String(today.getDate()).padStart(2, "0")}${String(
    today.getMonth() + 1
  ).padStart(2, "0")}${today.getFullYear()}`;

  // Combine random characters with date
  return `${randomChars}${datePart}`;
}

export function generatePassword(length: number = 8): string {
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  // const symbols = "!@#$%^&*()_+{}[]<>?";
  const allChars = upperCase + lowerCase ;
  // + symbols;

  let password = "";
  password += upperCase[Math.floor(Math.random() * upperCase.length)];
  password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
  // password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 3; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}


export const generateDateRange = (start: string, end: string): string[] => {
  const dateList: string[] = [];
  const startDate = new Date(start.split("-").reverse().join("-"));
  const endDate = new Date(end.split("-").reverse().join("-"));

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const formatted = d.toISOString().split("T")[0];
    dateList.push(formatted);
  }

  return dateList;
};