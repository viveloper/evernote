import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import List from '@material-ui/core/List';
import { Divider, Button } from '@material-ui/core';
import SidebarItemComponent from '../SidebarItem';

class SidebarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addingNote: false,
      title: null
    };
  }

  render() {
    const { classes, notes, selectedNoteIndex } = this.props;
    if (notes) {
      return (
        <div className={classes.sidebarContainer}>
          <Button className={classes.newNoteBtn} onClick={this.newNoteBtnClick}>
            {this.state.addingNote ? 'Cancel' : 'New Note'}
          </Button>
          {this.state.addingNote ? (
            <div>
              <input
                className={classes.newNoteInput}
                type="text"
                placeholder="Enter Note Title"
                onKeyUp={e => this.updateTitle(e.target.value)}
              />
              <Button
                className={classes.newNoteSubmitBtn}
                onClick={this.newNote}
              >
                Submit Note
              </Button>
            </div>
          ) : null}
          <List>
            {notes.map((note, index) => (
              <div key={note.id}>
                <SidebarItemComponent
                  note={note}
                  index={index}
                  selectedNoteIndex={selectedNoteIndex}
                  selectNote={this.selectNote}
                  deleteNote={this.deleteNote}
                />
                <Divider />
              </div>
            ))}
          </List>
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  newNoteBtnClick = () => {
    this.setState(prevState => ({
      title: null,
      addingNote: !prevState.addingNote
    }));
  };

  updateTitle = title => {
    this.setState({
      title
    });
  };

  newNote = () => {
    this.props.newNote(this.state.title);
    this.setState({
      title: null,
      addingNote: false
    });
  };

  selectNote = (note, index) => {
    this.props.selectNote(note, index);
  };

  deleteNote = (note, index) => {
    this.props.deleteNote(note, index);
  };
}

export default withStyles(styles)(SidebarComponent);
