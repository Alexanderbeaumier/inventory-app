import React, { useState } from "react";
import DOMPurify from "dompurify"; // Importing DOMPurify to sanitize inputs and prevent XSS
import apiURL from "../api"; // API base URL for making backend requests

function Form() {
  // State variables for form fields
  const [name, setName] = useState(""); // Stores the name of the item
  const [price, setPrice] = useState(""); // Stores the price of the item
  const [description, setDescription] = useState(""); // Stores the description of the item
  const [category, setCategory] = useState(""); // Stores the category of the item
  const [image, setImage] = useState(""); // Stores the image URL for the item
  const [searchQuery, setSearchQuery] = useState(""); // Stores the search query entered by the user
  const [searchResults, setSearchResults] = useState([]); // Stores the search results from the backend

  // Function to handle form submission for creating a new item
  async function submitForm(e) {
    e.preventDefault(); // Prevents the default form submission behavior (page reload)

    // Create a new item object and sanitize inputs to prevent XSS
    const newItemForm = {
      name: DOMPurify.sanitize(name), // Sanitize the name input
      price: price, // Price is numeric, no sanitization needed here
      description: DOMPurify.sanitize(description), // Sanitize the description input
      category: DOMPurify.sanitize(category), // Sanitize the category input
      image: DOMPurify.sanitize(image), // Sanitize the image URL
    };

    // Send a POST request to the backend to create a new item
    await fetch(`${apiURL}/items`, {
      method: "POST", // HTTP POST method
      headers: { "Content-type": "application/json" }, // Set the content type to JSON
      body: JSON.stringify(newItemForm), // Convert the item object to JSON
    });

    // Clear the form fields after submission
    setName("");
    setPrice("");
    setCategory("");
    setDescription("");
    setImage("");
  }

  // Function to handle search queries and display filtered results
  async function handleSearch(e) {
    e.preventDefault(); // Prevents the default form submission behavior (page reload)

    // Sanitize the search query to prevent XSS attacks
    const sanitizedQuery = DOMPurify.sanitize(searchQuery);

    // Fetch items from the backend using the sanitized search query
    const response = await fetch(`${apiURL}/items?search=${encodeURIComponent(sanitizedQuery)}`);
    const items = await response.json(); // Parse the JSON response

    // Sanitize the received data before rendering it
    const sanitizedResults = items.map((item) => ({
      ...item, // Retain all properties of the item
      name: DOMPurify.sanitize(item.name), // Sanitize the name
      description: DOMPurify.sanitize(item.description), // Sanitize the description
    }));

    setSearchResults(sanitizedResults); // Update the search results state
  }

  return (
    <>
      <div className="formStyle">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="searchBar">
          <label>
            Search:
            <input
              type="text" // Input type is text
              value={searchQuery} // Bind the searchQuery state
              onChange={(e) => setSearchQuery(e.target.value)} // Update state on input change
              placeholder="Search items..." // Placeholder text for the input
            />
          </label>
          <button type="submit">Search</button> {/* Button to submit the search */}
        </form>

        {/* Display Search Results */}
        <div className="searchResults">
          {searchResults.length > 0 ? (
            <ul>
              {/* Map over the search results and display them */}
              {searchResults.map((item) => (
                <li key={item.id}> {/* Unique key for each item */}
                  {/* Render sanitized item name and description */}
                  <strong>{item.name}</strong> - ${item.price}
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found.</p> // Message when no search results are found
          )}
        </div>

        {/* Item Form */}
        <form onSubmit={submitForm}>
          {/* Input for the name of the item */}
          <label>
            Name of Item:
            <input
              value={name} // Bind the name state
              onChange={(e) => setName(e.target.value)} // Update state on input change
              placeholder="Name" // Placeholder text
            />
          </label>

          {/* Input for the price of the item */}
          <label>
            Price:
            <input
              type="number" // Input type is number
              value={price} // Bind the price state
              onChange={(e) => setPrice(e.target.value)} // Update state on input change
              placeholder="Price" // Placeholder text
            />
          </label>

          {/* Input for the description of the item */}
          <label>
            Description:
            <input
              value={description} // Bind the description state
              onChange={(e) => setDescription(e.target.value)} // Update state on input change
              placeholder="Description of item" // Placeholder text
            />
          </label>

          {/* Input for the category of the item */}
          <label>
            Category:
            <input
              value={category} // Bind the category state
              onChange={(e) => setCategory(e.target.value)} // Update state on input change
              placeholder="Category of item" // Placeholder text
            />
          </label>

          {/* Input for the image URL of the item */}
          <label>
            Image:
            <input
              value={image} // Bind the image state
              onChange={(e) => setImage(e.target.value)} // Update state on input change
              placeholder="Image of items" // Placeholder text
            />
          </label>
          <button type="submit">Submit form</button> {/* Button to submit the form */}
        </form>
      </div>
    </>
  );
}

export default Form;
