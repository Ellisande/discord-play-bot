Feature: Users can ask who plays a game and get a list of player

    Scenario: User asks for the players of game in his channel
        Given a channel {channel1}
        And a guild {guild1}
        And a user {user1}
        And user {user2} plays {game1}
        When the user says who plays game1
        Then the bot responds with {game1 players: <@user2>}

    Scenario: No one plays the requested game
        Given a channel {channel1}
        And a guild {guild1}
        And a user {user1}
        And no one plays any games
        When the user says does anyone play game2
        Then the bot responds with {No one plays game2}