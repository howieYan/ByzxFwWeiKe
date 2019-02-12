import React from 'react';
import {
    View,
    StyleSheet,
    WebView
} from 'react-native';
import Utils from "../../Store/Utils";
export default class Introduce extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };

    }
    componentDidMount () {
    }
    componentWillReceiveProps (nextProps) {
        this.setState({
            data: nextProps.data
        })
    }
    render() {
        return (
                <View style={[styles.content, {height: Utils.size.height}]}>
                    <View style={styles.IntroduceMain}>
                        <WebView
                            bounces={false}
                            originWhitelist={['*']}
                            scalesPageToFit={Utils.size.os === 'ios' ? false : true}
                            source={{html: this.state.data.pg_content,  baseUrl: ''}}
                            style={{width: Utils.size.width - 20, height: Utils.size.height}}
                        >
                        </WebView>
                    </View>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    IntroduceMain: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
    },
});

