const Profile = () => {
  const obj = `
   {
          const voters = {
  Lucia: { population: 53203 },
  Lubica: { population: 19483 },
  Jan: { population: 31132 },
  Vladimir: { population: 79305 },
  Vladislav: { population: 75561 },
   Viliam: { population: 58560 },
  Michal: { population: 15319 },
  Jan: { population: 10646 },
  PavolT: { population: 126400 },
  Frantisek: { population: 92759 },
    Michal: { population: 61913 },
  Jozef: { population: 33964 },
  Martina: { population: 82025 },
  Jan: { population: 179 },
    Julia: { population: 3743 },
  PavolP: { population: 13907 },
  Anton: { population: 48640 },
  Jozef: { population: 2399 },
};

 // Function to calculate total population from users who voted
  function calculateTotalPopulationFromVotes(votes) {
    return Object.keys(votes).reduce((total, voter) => {
      if (votes[voter] && voters[voter]) {
        return total + voters[voter].population;
      }
      return total;
    }, 0);
  }

    const totalPopulation = calculateTotalPopulationFromVotes(votes);
// Function to determine if the voting is successful
function isVotingSuccessful(votes) {
  let totalWeight = 0;
  let agreedWeight = 0;
  let votedCount = 0;

  // Calculate weights based on votes cast 
  for (const voter of Object.keys(voters)) {
    if (votes[voter]) { // Check if the voter has voted
      const weight = (voters[voter].population / totalPopulation) * 100; // Calculate individual weight
      totalWeight += weight; // Total weight of votes cast
      votedCount++;

      if (votes[voter] === 'yes') {
        agreedWeight += weight; // Weight of "for" votes
      }
    }
  }

  // Check if at least 50% of the voted members agreed
  const agreementThreshold = votedCount * 0.5;
  const successThreshold = totalWeight * 0.51;

  return agreedWeight >= successThreshold && agreedWeight > 0 && votedCount >= agreementThreshold;
}

// Example usage:
const votesCast = {
  Frantisek: undefined,   // Frantisek doesnt vote
  PavolP: undefined, // PavolP doesnt vote
  Lubica: undefined, // Not voted
  Pavol: undefined, // Not voted
  Anton: undefined,
  Martina:"yes",
  PavolT:"yes",
  Jan:"no",
  Vladimir:undefined,
};

const result = isVotingSuccessful(votesCast);
console.log(result ? "Approved!" : "Not approved.")}
  `;
  return (
    <div className="container">
      <h1>Hello and vote, there is 2 types of voting:</h1>
      <p>
        1st:Regular based of amount of voters and their vote and 2nd. based of
        vote weight (according population,every voter has certain vote weight
        based on population), there will be always 18 poeple in voters object
        and total population will be amount of people which voted(doesnt matter
        if they voted "for", "against" or "abstain" from voting),there is also
        one special user without population. , In case voting in group of voters
        is successful/approved and special user vote "for" overal voting is
        approved. in code snippet there is Javascript solution
        <pre>
          <code>
            <p>{obj} </p>
          </code>
        </pre>
      </p>
      <div></div>
    </div>
  );
};

export default Profile;
