Feature: A user can say they are playing a game

    Scenario: The user plays a game
        Given a guild {guild1}
        And a channel {channel1}
        And a user {user1}
        When the user says !i_play {game1}
        Then the guild {guild1} exists
        And the game {game1} exists
        And the user {user1} exists in the {game1} player list
        And the bot responds with {<@user1> is now playing game1}