const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Twitter Contract", function () {
  let Twitter;
  let twitter;
  let owner;

  const NUM_TOTAL_NOT_MY_TWEETS = 5;
  const NUM_TOTAL_MY_TWEETS = 3;

  let totalTweets;
  let totalMyTweets;

  beforeEach(async function () {
    Twitter = await ethers.getContractFactory("TwitterContract");
    [owner, addr1, addr2] = await ethers.getSigners();
    twitter = await Twitter.deploy();

    totalTweets = [];
    totalMyTweets = [];

    for (let i = 0; i < NUM_TOTAL_NOT_MY_TWEETS; i++) {
      let tweet = {
        tweetText: "Random text with id :" + i,
        username: addr1,
        isDeleted: false,
      };

      await twitter.connect(addr1).addTweet(tweet.tweetText, tweet.isDeleted);
      totalTweets.push(tweet);
    }

    for (let i = 0; i < NUM_TOTAL_MY_TWEETS; i++) {
      let tweet = {
        tweetText: "Random text with id :" + i,
        username: owner,
        isDeleted: false,
      };

      await twitter.addTweet(tweet.tweetText, tweet.isDeleted);
      totalTweets.push(tweet);
    }
  });

  describe("Add Tweet", function () {
    it("should emit AddTweet Event", async function () {
      let tweet = {
        tweetText: "new Tweet",
        isDeleted: false,
      };

      await expect(await twitter.addTweet(tweet.tweetText, tweet.isDeleted))
        .to.emit(twitter, "AddTweet")
        .withArgs(owner.address, NUM_TOTAL_MY_TWEETS + NUM_TOTAL_NOT_MY_TWEETS);
    });
  });

  describe("Get Tweets", function () {
    it("Should return the correct num of tweets", async function () {
      const tweetsFromChain = await twitter.getAllTweets();
      expect(tweetsFromChain.length).to.equal(
        NUM_TOTAL_MY_TWEETS + NUM_TOTAL_NOT_MY_TWEETS
      );
    });

    it("Should return the correct num of all my tweets", async function () {
      const myTweetsFromChain = await twitter.getMyTweets();
      console.log(myTweetsFromChain.length);
      expect(myTweetsFromChain.length).to.equal(NUM_TOTAL_MY_TWEETS);
    });
  });

  describe("Delete Tweet", function () {
    it("Should emit delete tweet event", async function () {
      const Tweet_id = 0;
      const Tweet_Deleted = true;

      await expect(twitter.connect(addr1).deleteTweet(Tweet_id, Tweet_Deleted))
        .to.emit(twitter, "DeleteTweet")
        .withArgs(Tweet_id, Tweet_Deleted);
    });
  });
});
