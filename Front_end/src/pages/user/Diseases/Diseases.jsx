import { useState } from "react";
import { searchDiseases } from "../../../api";
import "./Diseases.css";

export default function Diseases() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setIsSearching(true);
      const response = await searchDiseases(searchTerm);
      setSearchResults(response.results || response || []);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="diseases-container">
      <h1>Tra c?u b?nh</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="T�m ki?m b?nh..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">{isSearching ? "�ang t�m..." : "T�m"}</button>
      </form>

      {searchTerm && (
        <div className="results">
          <h2>K?t qu?: {searchResults.length}</h2>
          {searchResults.map((d, i) => (
            <div key={i} className="item">
              <h3>{d.name}</h3>
              <p>{d.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
