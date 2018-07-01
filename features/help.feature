Feature: Users can ask the bot for help

    Scenario: Users can ask for a list of commands
        Given a user {user1}
        When the user says to the bot {commands}
        Then the bot lists {7} commands

    Scenario: Users can ask for a list of commands
        Given a test user
        When the user says to the bot {commands}
        Then the bot lists {8} commands