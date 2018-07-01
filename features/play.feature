Feature: A user can say they are playing a game

    Scenario: The user plays a game
        Given a guild {guild1}
        And a channel {channel1}
        And a user {user1}
        When the user says to the bot {i play game1}
        Then the guild {guild1} exists
        And the game {game1} exists
        And the user {user1} is added to the players list
        And the bot responds with {<@user1> is now playing game1}

    Scenario: The user alread plays the game
        Given a guild {guild1}
        And a channel {channel1}
        And a user {user1}
        And the user {user1} plays {game1}
        When the user says to the bot {i play game1}
        And the bot responds with {<@user1> already plays game1}