const Header = ({ status, setStatus }) => {
  return (
    <header>
      <h1>
        {status === "main" && "Genshin Builds"}
        {status === "owned-characters-selection" && "Select Owned Characters"}
        {status === "builds" && "Check Builds"}
      </h1>
      <div>
        <button onClick={() => setStatus("main")}>Go to Main</button>
        <button onClick={() => setStatus("owned-characters-selection")}>Set owned Characters</button>
        <button onClick={() => setStatus("builds")}>Check builds</button>
      </div>
    </header>
  );
};

export default Header;
