const Header = ({ status, setStatus }) => {
  return (
    <header>
      <h1>
        {status === "main" && "Genshin Builds"}
        {status === "owned-characters-selection" && "Select Owned Characters"}
        {status === "builds" && "Check Builds"}
      </h1>
      <div>
        {
          status != "main" && <button onClick={() => setStatus("main")}>Home</button>
        }
        {
          status != "owned-characters-selection" && <button onClick={() => setStatus("owned-characters-selection")}>Set owned Characters</button>
        
        }
        {
          status != "builds" && <button onClick={() => setStatus("builds")}>Check Builds</button>
        }
        {
          status != "Scrapper" && <button onClick={() => setStatus("Scrapper")}>Scrapper</button>
        }
      </div>
    </header>
  );
};

export default Header;
