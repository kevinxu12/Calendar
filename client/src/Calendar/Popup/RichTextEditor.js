import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import FroalaEditorComponent from 'react-froala-wysiwyg';
import React from 'react';
const config = {
    charCounterCount: false
}
class EditorComponent extends React.Component {

    constructor(props) {
        super(props);

        this.handleModelChange = this.handleModelChange.bind(this);

        this.state = {
            model: this.props.description || 'Insert Description'
        };
    }
    handleModelChange(model) {
        this.setState({
            model: model
        }, () => {this.props.sendResults(model)});
    }

    render() {
        return <FroalaEditorComponent
            model={this.state.model}
            config={config}
            onModelChange={this.handleModelChange}
        />
    }
}

export default EditorComponent;