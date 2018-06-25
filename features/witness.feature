Feature: Users can opt into having their games be watched and added

    Scenario: Users can start being watched
        Given a user {user1}
        And a guild {guild1}
        When the user says witness me
        Then the watched users for {guild1} contains {user1}