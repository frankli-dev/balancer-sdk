import { JsonRpcProvider } from '@ethersproject/providers';
import { expect } from 'chai';
import { FeeDistributorRepository } from './repository';

describe('FeeDistributorRepository', () => {
  const repo = new FeeDistributorRepository(
    '',
    '',
    '',
    '',
    '',
    new JsonRpcProvider('', 1)
  );

  const claimableTokens: string[] = [
    '0x7B50775383d3D6f0215A8F290f2C9e2eEBBEceb2', // bb-a-USD v1
    '0xA13a9247ea42D743238089903570127DdA72fE44', // bb-a-USD v2
    '0xba100000625a3754423978a60c9317c58a424e3D', // BAL
  ];

  describe('.getPreviousWeek', () => {
    // Wednesday
    const now = new Date('2022-07-01 11:11:11').getTime();
    const previousWeekTs = repo.getPreviousWeek(now);
    const previousWeek = new Date(previousWeekTs * 1e3);

    it("goes back to last week's Thursday since last Thursday", () => {
      const dayOfTheWeek = previousWeek.getUTCDay();
      expect(dayOfTheWeek).to.eq(4);
      const day = previousWeek.getUTCDate();
      expect(day).to.eq(23);
      const month = previousWeek.getUTCMonth(); // returns 0..11
      expect(month).to.eq(5);
    });

    it('goes back to midnight', () => {
      const hour = previousWeek.getUTCHours();
      expect(hour).to.eq(0);
      const minutes = previousWeek.getUTCMinutes();
      expect(minutes).to.eq(0);
      const seconds = previousWeek.getUTCSeconds();
      expect(seconds).to.eq(0);
    });
  });

  describe('.claimBalances', () => {
    it("should return encoded call", (done) => {
      const data = repo.claimBalances('0x549c660ce2B988F588769d6AD87BE801695b2be3', claimableTokens);
      expect(data).to.eq('0x88720467000000000000000000000000549c660ce2b988f588769d6ad87be801695b2be3000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000030000000000000000000000007b50775383d3d6f0215a8f290f2c9e2eebbeceb2000000000000000000000000a13a9247ea42d743238089903570127dda72fe44000000000000000000000000ba100000625a3754423978a60c9317c58a424e3d');
      done();
    });
  });
  describe('.claimBalance', () => {
    it("should return encoded call", (done) => {
      const data = repo.claimBalance('0x549c660ce2B988F588769d6AD87BE801695b2be3', claimableTokens[1]);
      expect(data).to.eq('0xca31879d000000000000000000000000549c660ce2b988f588769d6ad87be801695b2be3000000000000000000000000a13a9247ea42d743238089903570127dda72fe44');
      done();
    });
  });
});
