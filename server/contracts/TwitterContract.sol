// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

contract TwitterContract {


    event AddTweet(address recipient,uint tweetId);
    event DeleteTweet(uint tweetId,bool isDeleted);

    struct Tweet{
        uint id;
        address username;
        string tweetText;
        bool isDeleted;
    }

    Tweet[] private tweets;

    //maps tweet id to the wallet address
    mapping (uint256 => address) tweetToOwner;

    //Method to add new tweet
    function addTweet(string memory tweetText,bool isDeleted) external{
        uint tweetId = tweets.length;
        tweets.push(Tweet(tweetId,msg.sender,tweetText,isDeleted));
        tweetToOwner[tweetId] = msg.sender;
        emit AddTweet(msg.sender,tweetId);
    }

    //Method to get all the tweets
    function getAllTweets() external view returns(Tweet[] memory){
        Tweet[] memory temp = new Tweet[](tweets.length);

        uint counter = 0;

        for(uint i=0;i<tweets.length;i++){
            if(tweets[i].isDeleted == false){
                temp[counter] = tweets[i];
                counter++;
            }
        }
        Tweet[] memory result = new Tweet[](counter);
        for(uint i=0;i<counter;i++){
            result[i] = temp[i];
        }
        return result;
    }

    //Method to get only the users tweets
    function getMyTweets() external view returns(Tweet[] memory){
        Tweet[] memory temp = new Tweet[](tweets.length);

        uint counter = 0;

        for(uint i=0;i<tweets.length;i++){
            if(tweetToOwner[i] == msg.sender && tweets[i].isDeleted == false){
                temp[counter] = tweets[i];
                counter++;
            }
        }
        Tweet[] memory result = new Tweet[](counter);
        for(uint i=0;i<counter;i++){
            result[i] = temp[i];
        }
        return result;
    }

    //mEthod to delete tweet
    function deleteTweet(uint tweetId,bool isDeleted) external{
        if(tweetToOwner[tweetId] == msg.sender){
            tweets[tweetId].isDeleted = isDeleted;
            emit DeleteTweet(tweetId,isDeleted);
        }
    }
}