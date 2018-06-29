Feature: Users can opt into having their games be watched and added

    Scenario: Users can start being watched
        Given a user {user1}
        And a guild {guild1}
        When the user says witness me
        Then the user {user1} is added to the watched players list

    Scenario: A watched user is automatically added to new games
    Scenario: New games are not added if the watched user is streaming
    Scenario: No error is thrown if the watched user is already a player of the game
    Scenario: No error is thrown if the watched user's game name can't be determined