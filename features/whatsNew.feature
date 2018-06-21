Feature: Users can ask play bot about what has changed

    Scenario: User asks for the newest thing
        Given a channel {channel1}
        And a user {user1}
        And user {user2} plays {game1}
        When the user says what's new?
        Then the bot responds with {[1]}


    Scenario: User asks for the 5 newest things
        Given a channel {channel1}
        And a user {user1}
        And user {user2} plays {game1}
        When the user says what's new?
        Then the bot responds with {[1]}