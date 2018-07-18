Feature: A user can say they have quit a game

    Scenario: The user quits a game
        Given a guild {guild1}
        And a channel {channel1}
        And a user {user1}
        And the user {user1} plays {game1}
        When the user says to the bot {i quit game1}
        Then the guild {guild1} exists
        And the game {game1} exists
        And the user {user1} is no longer on the players list
        And the bot responds with {<@user1> is no longer playing game1}

    Scenario: The user doesn't play the game
        Given a guild {guild1}
        And a channel {channel1}
        And a user {user1}
        When the user says to the bot {i quit game1}
        Then the bot responds with {<@user1> does not play game1}