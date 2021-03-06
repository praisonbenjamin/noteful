import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import AppContext from '../AppContext';
import PropTypes from "prop-types";

class FolderNoteList extends React.Component {
  static contextType = AppContext;

  handleDelete = (noteId) => {
    const deleteUrl = `http://localhost:9090/notes/${noteId}`;

    fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        } else {
          this.context.handleNoteDelete(noteId);
        }
      })
      .catch((error) => console.log(error));
  };

  render() {
    const { notes } = this.context;
    let folderId = this.props.match.params.folderId;

    const filteredNotes = notes.filter((note) => note.folderId === folderId);

    const notesArray = filteredNotes.map((note) => {
      let date = new Date(note.modified);
      let formatted = format(date, 'do LLL yyyy');

      return (
        <li className="note" key={note.id}>
          <div>
            <h2>
              <Link to={`/note/${note.id}`}>{note.name}</Link>
            </h2>
          </div>
          <div>
            <p>Note modified on: {formatted}</p>
            <button onClick={() => this.handleDelete(note.id)}>
              Delete Note
            </button>
          </div>
        </li>
      );
    });

    return (
      <div className="list">
        <Link to="/add-note">
          <button className="add-note">Add Note</button>
        </Link>

        {notesArray.length === 0 && (
          <p>
            There are no notes in this folder. Try again after adding some!
          </p>
        )}
        <ul>{notesArray}</ul>
      </div>
    );
  }
}

FolderNoteList.propTypes = {
  match: PropTypes.object,
};


export default FolderNoteList;