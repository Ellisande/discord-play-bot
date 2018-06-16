Feature: Users can ask who plays a game and get a list of player

    Scenario: User asks for the players of game in his channel
        Given a channel {channel1}
        And a user {user1}
        And user {user2} plays {game1}
        When the user says !who_plays {game1}
        Then the bot responds with {game1 players: <@user2>}