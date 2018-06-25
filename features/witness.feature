Feature: Users can opt into having their games be watched and added

    Scenario: Users can start being watched
        Given a user {user1}
        And a guild {guild1}
        When the user says witness me
        Then the watched users for {guild1} contains {user1}

    Scenario: A watched user is automatically added to new games
    Scenario: No error is thrown if the watched user is already a player of the game
    Scenario: No error is thrown if the watched user's game name can't be determined