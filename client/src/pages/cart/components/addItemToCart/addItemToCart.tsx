import { useState } from "react";

export const AddItemToCart = () => {
  const [name, setName] = useState<string>("");

  const handleAdd = () => {
    setName("");
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleAdd}>Adicionar item</button>
    </div>
  );
};
