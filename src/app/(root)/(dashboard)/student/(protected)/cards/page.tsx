import StudentCards from "@/features/financials-and-notifications/StudentCards";
import { getSavedCardsQuery } from "@/services/cards/queries";

const StudentCardsPage = async () => {
  const response = await getSavedCardsQuery();

  return <StudentCards cards={response.data.cards} />;
};

export default StudentCardsPage;


