export default function randomDate() {
    const startDate = new Date("2024-07-19");
    const today = new Date();

    const startTimestamp = startDate.getTime();
    const endTimestamp = today.getTime();

    const randomTimestamp = Math.floor(Math.random() * (endTimestamp - startTimestamp + 1)) + startTimestamp;

    const randomDate = new Date(randomTimestamp);

    // Format the date as "yyyy-mm-dd"
    const year = randomDate.getFullYear();
    const month = String(randomDate.getMonth() + 1).padStart(2, '0');
    const day = String(randomDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
