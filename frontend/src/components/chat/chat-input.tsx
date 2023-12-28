import { Input } from "react-chat-elements";

import { useRef, useState } from "react";
import { Button } from "react-bootstrap";

export interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled: boolean;
}

let clearInput = () => {};

function ChatInput(props: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef();

  return (
    <Input
      referance={inputRef}
      placeholder="Tapez ici..."
      multiline={true}
      value={value}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
      }}
      clear={(clear: any) => (clearInput = clear)}
      maxHeight={50}
      rightButtons={
        <Button
          size="sm"
          disabled={props.disabled}
          onClick={() => {
            props.onSubmit(value);
            setValue("");
            clearInput();
          }}
        >
          Envoyer
        </Button>
      }
    />
  );
}

export default ChatInput;
