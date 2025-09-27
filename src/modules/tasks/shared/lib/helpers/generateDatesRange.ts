export const generateDatesRange = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}): Date[] => {
  const dateArray = [];

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
};
