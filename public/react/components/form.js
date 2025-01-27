import React, { useState } from "react";
import apiURL from "../api";

function Form() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search bar
  const [searchResults, setSearchResults] = useState([]); // State for search results

  async function submitForm(e) {
    e.preventDefault();

    const newItemForm = {
      name: name,
      price: price,
      description: description,
      category: category,
      image: image,
    };

    await fetch(`${apiURL}/items`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newItemForm),
    });

    setName("");
    setPrice("");
    setCategory("");
    setDescription("");
    setImage("");
  }

  async function handleSearch(e) {
    e.preventDefault();
    const response = await fetch(`${apiURL}/items`); // Fetch all items
    const items = await response.json();

    // Filter items based on the search query
    const filteredResults = items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filteredResults);
  }

  return (
    <>
      <div className="formStyle">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="searchBar">
          <label>
            Search:
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
            />
          </label>
          <button type="submit">Search</button>
        </form>

        {/* Display Search Results */}
        <div className="searchResults">
          {searchResults.length > 0 ? (
            <ul>
              {searchResults.map((item) => (
                <li key={item.id}>
                  {/* Render unsafe content to allow XSS */}
                  <strong dangerouslySetInnerHTML={{ __html: item.name }}></strong> - ${item.price}
                  <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found.</p>
          )}
        </div>

        {/* Item Form */}
        <form onSubmit={submitForm}>
          <label>
            Name of Item:
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </label>

          <label>
            Price:
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
            />
          </label>
          <label>
            Description:
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description of item"
            />
          </label>
          <label>
            Category:
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category of item"
            />
          </label>

          <label>
            Image:
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Image of items"
            />
          </label>
          <button type="submit">Submit form</button>
        </form>
      </div>
    </>
  );
}

export default Form;
