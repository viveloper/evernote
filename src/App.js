import React from 'react';
import './App.css';
import SidebarComponent from './components/Sidebar';
import EditorComponent from './components/Editor';

import firebase from 'firebase';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNoteIndex: null,
      selectedNote: null,
      notes: null
    };
  }

  render() {
    return (
      <div className="app-container">
        <SidebarComponent
          notes={this.state.notes}
          selectedNoteIndex={this.state.selectedNoteIndex}
          selectNote={this.selectNote}
          deleteNote={this.deleteNote}
          newNote={this.newNote}
        />
        {this.state.selectedNote ? (
          <EditorComponent
            selectedNote={this.state.selectedNote}
            selectedNoteIndex={this.state.selectedNoteIndex}
            notes={this.state.notes}
            noteUpdate={this.noteUpdate}
          />
        ) : null}
      </div>
    );
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection('notes')
      .onSnapshot(serverUpdate => {
        const notes = serverUpdate.docs.map(_doc => {
          const data = _doc.data();
          data['id'] = _doc.id;
          return data;
        });
        // console.log(notes);
        this.setState({
          notes: notes
        });
      });
  }

  selectNote = (note, index) => {
    this.setState({
      selectedNoteIndex: index,
      selectedNote: note
    });
  };

  deleteNote = (note, index) => {
    firebase
      .firestore()
      .collection('notes')
      .doc(note.id)
      .delete()
      .then(() => {
        if (this.state.selectedNoteIndex === index) {
          this.setState({
            selectedNoteIndex: null,
            selectedNote: null
          });
        } else if (this.state.selectedNoteIndex > index) {
          this.setState({
            selectedNoteIndex: this.state.selectedNoteIndex - 1
          });
        } else {
        }
      });
  };

  newNote = title => {
    const newNote = {
      title,
      body: '',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    firebase
      .firestore()
      .collection('notes')
      .add(newNote)
      .then(doc => {
        const addedNote = this.state.notes.filter(
          note => note.id === doc.id
        )[0];
        const addedNoteIndex = this.state.notes.indexOf(addedNote);

        this.setState({
          selectedNote: addedNote,
          selectedNoteIndex: addedNoteIndex
        });
      });
  };

  noteUpdate = (id, noteObj) => {
    firebase
      .firestore()
      .collection('notes')
      .doc(id)
      .update({
        title: noteObj.title,
        body: noteObj.body,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
  };
}

export default App;
