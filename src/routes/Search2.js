import React from "react";
import Downshift from "downshift";
import { gql, graphql } from "react-apollo";

const searchBooksQuery = gql`
  query($title: String!) {
    searchBooks(title: $title) {
      id
      title
    }
  }
`;

const Items = ({
  data: { loading, searchBooks },
  highlightedIndex,
  selectedItem,
  getItemProps
}) =>
  loading ? null : (
    <div>
      {searchBooks.slice(0, 10).map(({ title, id }, index) => (
        <div
          {...getItemProps({ item: title })}
          key={id}
          style={{
            backgroundColor: highlightedIndex === index ? "gray" : "white",
            fontWeight: selectedItem === title ? "bold" : "normal"
          }}
        >
          {title}
        </div>
      ))}
    </div>
  );

const FetchItems = graphql(searchBooksQuery, {
  options: ({ title }) => ({ variables: { title } })
})(Items);

const BasicAutocomplete = ({ items, onChange }) => (
  <Downshift onChange={onChange}>
    {({
      getInputProps,
      getItemProps,
      isOpen,
      inputValue,
      selectedItem,
      highlightedIndex
    }) => (
      <div>
        <input {...getInputProps({ placeholder: "Search a book!" })} />
        {isOpen ? (
          <div style={{ border: "1px solid #ccc" }}>
            <FetchItems
              title={inputValue}
              selectedItem={selectedItem}
              highlightedIndex={highlightedIndex}
              getItemProps={getItemProps}
            />
          </div>
        ) : null}
      </div>
    )}
  </Downshift>
);

export default () => (
  <BasicAutocomplete onChange={selectedItem => console.log(selectedItem)} />
);
