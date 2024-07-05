```mermaid

sequenceDiagram
    participant browser
    participant server

    Note right of browser:  The user writes "xxxxxx" in the text input and submits
    Note right of browser:  JavaSripct code handles the sending in JSON format and creates a new note and adds it to the "notes" array

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: Status code 201 created
    deactivate server

    