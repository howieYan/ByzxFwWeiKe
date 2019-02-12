import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Utils from "../../Store/Utils";
export default class Directory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            Video: [],
        };

    }
    componentDidMount () {
        this.setState({
            Video: this.props.data.video
        })
    }

    render() {
        return (
            <ScrollView style={[styles.content]}>
                <View style={[styles.content]}>
                    <View style={[styles.content]}>
                        {this.renderList()}
                    </View>
                </View>
            </ScrollView>
        );
    }
    renderList () {
        let List = [];
        let Total = this.state.Video.length;
        if (Total > 0) {
            this.state.Video.forEach((v, i) => {
                List.push(
                    <TouchableOpacity key={i} activeOpacity={0.5} onPress={this.OnVideo.bind(this, v)}>
                        <View style={styles.DirectoryMain}>
                            {
                                Number(v.pv_try_preview) === 2 ?
                                    <View style={{flexDirection: 'row'}}>
                                        {/*<Text style={[Number(v.pv_try_preview) === 2 ? styles.DirectoryMainTextLeft : styles.DirectoryMainTextBg]}>课时{i + 1}</Text>*/}
                                        <Text style={[Number(v.pv_try_preview) === 2 ? styles.DirectoryMainText : styles.DirectoryMainTextBg, styles.DirectoryMainTextStyle]} numberOfLines={1}>{v.pv_title}</Text>
                                    </View>
                                    :
                                    <View style={{flexDirection: 'row'}}>
                                        {/*<Text style={[styles.DirectoryMainTextBg]}>课时{i + 1}</Text>*/}
                                        <Text style={[styles.DirectoryMainTextBg, styles.DirectoryMainTextStyle]} numberOfLines={1}>{v.pv_title}</Text>
                                    </View>
                            }

                        </View>
                    </TouchableOpacity>
                )
            })
        } else {
            List.push(
                <View style={{flex: 1, width: Utils.size.width, height: 400,alignItems: 'center',justifyContent: 'center'}} key={Total}>
                    <Text>没有数据</Text>
                </View>
            )
        }
        return List;
    }
    OnVideo (record) {
        this.props.onPlayerVideo(record)
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    DirectoryMain: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
    },
    DirectoryMainTextLeft: {
        color: '#676767',
        width: 50,
        opacity: 0.5,
        fontSize: Utils.setSpText(16),
    },
    DirectoryMainText: {
        color: '#676767',
        opacity: 0.5,
        fontSize: Utils.setSpText(16),
    },
    DirectoryMainTextBg: {
        fontSize: Utils.setSpText(16),
        color: '#676767',
        opacity: 1,
    },
    DirectoryMainTextStyle: {
        // paddingLeft: 20,
    }
});

