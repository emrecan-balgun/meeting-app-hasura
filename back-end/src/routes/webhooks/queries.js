const GET_MEETING_PARTICIPANTS = `
query getParticipants($meeting_id: Int!){
    participants(
      where: {
        meeting_id: {
          _eq: $meeting_id
        }
      }
    ){
      user{
        id
        email
        fullName
      }
    }
  }
`;