Feature: Users can opt into having their games be watched and added

    Scenario: Users can start being watched
        Given a user {user1}
        And a guild {guild1}
        When the user says to the bot {witness me}
        Then the user {user1} is added to the watched players list
        And the bot responds with {we ride eternal - shiny and chrome!}

    Scenario: Users can start being watched with a harry potter theme
        Given a user {user1}
        And a guild {guild1}
        When the user says to the bot {I solemnly swear that I am up to no good}
        Then the user {user1} is added to the watched players list
        And the bot responds with {this little beauty's taught us more than all the teachers in this school}

    Scenario: Users can stop being watched with a harry potter theme
        Given a user {user1}
        And a guild {guild1}
        When the user says to the bot {mischief managed}
        Then the user {user1} is no longer on the watched players list
        And the bot responds with {things we lose have a way of coming back to us in the end, if not always in the way we expect}

    Scenario: A watched user is automatically added to new games
        Given a watched user {user1}
        And a guild {guild1}
        When the user's presence changes to playing {game1}
        Then the game is now played by user {user1}
        And the game {game1} is updated

    Scenario: Unwatched users are not added to new games
        Given a user {user1}
        And a guild {guild1}
        When the user's presence changes to playing {game1}
        Then the game is not played by user {user1}
        And the game {game1} is not updated

    Scenario: New games are not added if the watched user is streaming
        Given a watched user {user1}
        And a guild {guild1}
        When the user's presence changes to streaming {game1}
        Then the game is not played by user {user1}
        And the game {game1} is not updated

    Scenario: No error is thrown if the watched user is already a player of the game
        Given a watched user {user1}
        And a guild {guild1}
        And user {user1} plays {game1}
        When the user's presence changes to playing {game1}
        Then no error occurs

    Scenario: No error is thrown if the watched user's game name can't be determined
        Given a watched user {user1}
        And a guild {guild1}
        And user {user1} plays {game1}
        When the user's presence changes to playing an unknown game
        Then no error occurs
        Then the game {game1} is not updated