import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    WebView,
} from 'react-native';
import Utils from "../../../Store/Utils";
import {Loading} from "../../../Component/Loading";
export default class HelpFeedbackDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data: {},
        }
    }
    componentDidMount () {
        this.LoadData();
    }
    async LoadData () {
        try {
            let formData = new FormData();
            formData.append('hId', this.props.navigation.state.params.data.h_id);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/helperDetail', formData);
            if (Number(data.code) === 0) {
                this.setState({
                    data: data.result,
                })
            } else {
                Loading.Toast(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <View style={styles.content}>
                <View style={styles.messageHeader}>
                    <TouchableOpacity activeOpacity={0.8}
                                      navigator={this.props.navigator}
                                      onPress={this.onBackButton.bind(this)}>
                        <View style={styles.headerLeft}>
                            <Image
                                style={styles.messageHeaderBack}
                                source={require('../../../Image/Back.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <Animated.Text numberOfLines={1} style={[styles.messageHeaderTitle]}>{this.props.navigation.state.params.name}</Animated.Text>
                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={styles.headerRight} >
                            <Text style={styles.headerRightText}>{}</Text>
                        </View>

                    </TouchableOpacity>
                </View>
                <View style={[styles.content]}>
                    <View style={styles.HelpFeedbackDetailsMain}>
                        <View style={styles.HelpFeedbackDetailsMainTitle}>
                            <Text style={styles.HelpFeedbackDetailsMainTitleText}>{this.state.data.h_title}</Text>
                        </View>
                        {/*<Text style={styles.HelpFeedbackDetailsMainContent}>{this.state.data.h_content}</Text>*/}
                    </View>
                    <View style={styles.content}>
                        <WebView
                            originWhitelist={['*']}
                            setHorizontalScrollBarEnabled={false}
                            setVerticalScrollBarEnabled={false}
                            scalesPageToFit={Utils.size.os === 'ios' ? false : true}
                            style={styles.content}
                            source={{ html: this.state.data.h_content, baseUrl: '' }}
                            bounces={false}
                        />
                    </View>
                </View>

            </View>
        );
    }
    // 返回
    onBackButton () {
       this.props.navigation.goBack();
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messageHeader: {
        height: (Utils.size.os === 'ios') ? 74 : 42,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
        paddingTop: ( Utils.size.os === 'ios') ? 30 : 0,
        backgroundColor: '#fff',
    },
    headerRightText: {
        color: '#36b9c8',
        fontSize: Utils.setSpText(14),
    },
    swipoutLineBgColor: {
        backgroundColor: '#fff',
    },
    messageHeaderTitle: {
        color: '#101010',
        fontWeight: 'bold',
        fontSize: Utils.setSpText(16),
    },
    messageHeaderBack: {
        width: 20,
        height: 20,
    },
    headerLeft: {
        width: 50,
    },
    headerRight: {
        width: 50,
        flexDirection:'row-reverse',
    },
    // 内容:
    HelpFeedbackDetailsMain: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    HelpFeedbackDetailsMainTitle: {
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    HelpFeedbackDetailsMainTitleText: {
        fontSize: Utils.setSpText(18),
        color: '#000000',
    },
    HelpFeedbackDetailsMainContent: {
        paddingTop: 20,
        fontSize: Utils.setSpText(16),
        color: '#242424',
        lineHeight: 20,
    }
});

