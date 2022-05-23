export const GET_MEETING_PARTICIPANTS = `
query getParticipants($id: Int!){
    meetings_by_pk(id: $id){
      title
      meeting_date
      user{
        email
        fullName
      }
      participants{
        user{
          email
        }
      }
    }
  }
`;