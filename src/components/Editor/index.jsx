import React from 'react';
import ReactQuill from 'react-quill';
import debounce from '../../helpers';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

class EditorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      title: '',
      id: ''
    };
  }

  updateBody = value => {
    this.setState(
      {
        text: value
      },
      () => {
        this.update();
      }
    );
  };

  updateTitle = value => {
    this.setState(
      {
        title: value
      },
      () => {
        this.update();
      }
    );
  };

  update = debounce(() => {
    this.props.noteUpdate(this.state.id, {
      title: this.state.title,
      body: this.state.text
    });
  }, 1500);

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.editorContainer}>
        <BorderColorIcon className={classes.editIcon} />
        <input
          className={classes.titleInput}
          type="text"
          placeholder="Note title..."
          value={this.state.title ? this.state.title : ''}
          onChange={e => this.updateTitle(e.target.value)}
        />
        <ReactQuill
          value={this.state.text}
          onChange={this.updateBody}
        ></ReactQuill>
      </div>
    );
  }

  componentDidMount() {
    this.setState({
      title: this.props.selectedNote.title,
      text: this.props.selectedNote.body,
      id: this.props.selectedNote.id
    });
  }

  componentDidUpdate() {
    if (this.state.id !== this.props.selectedNote.id) {
      this.setState({
        title: this.props.selectedNote.title,
        text: this.props.selectedNote.body,
        id: this.props.selectedNote.id
      });
    }
  }
}

export default withStyles(styles)(EditorComponent);
