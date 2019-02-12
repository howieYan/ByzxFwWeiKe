import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    AsyncStorage,
    TextInput,
    ScrollView,
} from 'react-native';
import Utils from "../../../Store/Utils";
import {Loading} from "../../../Component/Loading";

export default class Feedback extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            isMobile: /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/,
            mobile: '',
            content: '',
            email: '',
            title: ''
        }
    }
    componentDidMount () {
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
                <ScrollView
                    scrollEnabled={false}     //防止滑动
                    contentContainerStyle={{flex:1}}
                    ref="scrollView">
                    <View style={[styles.content]}>
                        <View style={styles.FeedbackMain}>
                            <Text style={styles.FeedbackMainTitle}>标题</Text>
                            <View style={{
                                borderBottomColor: '#F2F1F2',
                                borderBottomWidth: 1,
                            }}>
                                <TextInput
                                    onBlur={this._reset.bind(this)}
                                    onFocus={this._onFocus.bind(this, 'textInput')}
                                    style={styles.textInputs}
                                    onChangeText={(text) =>this.setState({title: text})}
                                    value={this.state.title}
                                    placeholder={'请输入您的标题'}
                                />
                            </View>
                        </View>
                        <View style={styles.FeedbackMain}>
                            <Text style={styles.FeedbackMainTitle}>问题和意见</Text>
                            <View style={{paddingBottom: 20,}}>
                                <TextInput
                                    multiline = {true}
                                    textAlignVertical= 'top'
                                    underlineColorAndroid="transparent"
                                    numberOfLines = {4}
                                    style={styles.FeedbackMainTitleContent}
                                    onChangeText={(text) => this.setState({content: text})}
                                    value={this.state.content}
                                    placeholder={'简要描述你要反馈的问题和意见'}
                                />
                            </View>
                        </View>
                        <View style={{width: Utils.size.width,height: 10,backgroundColor: '#F6F6F6'}}/>
                        <View style={styles.FeedbackMain}>
                            <Text style={styles.FeedbackMainTitle}>联系方式</Text>
                            <View style={{
                                borderBottomColor: '#F2F1F2',
                                borderBottomWidth: 1,
                            }}>
                                <TextInput
                                    onBlur={this._reset.bind(this)}
                                    onFocus={this._onFocus.bind(this, 'textInput')}
                                    style={styles.textInputs}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(text) =>this.setState({mobile: text})}
                                    value={this.state.mobile}
                                    maxLength={11}
                                    placeholder={'请输入您的联系电话'}
                                />
                            </View>
                            <View style={{
                                borderBottomColor: '#F2F1F2',
                                borderBottomWidth: 1,
                            }}>
                                <TextInput
                                    onBlur={this._reset.bind(this)}
                                    onFocus={this._onFocus.bind(this, 'textInput')}
                                    style={styles.textInputs}
                                    underlineColorAndroid="transparent"
                                    // onBlur={this._reset.bind(this, 'email')}
                                    onChangeText={(text) =>this.setState({email: text})}
                                    value={this.state.email}
                                    placeholder={'请输入您的邮箱'}
                                />
                            </View>
                        </View>
                        <View style={styles.HelpFeedbackBott}>
                            <TouchableOpacity activeOpacity={0.8} onPress={this.OnFeedback.bind(this)}>
                                <View style={styles.HelpFeedbackBottView}>
                                    <Text style={styles.HelpFeedbackBottViewText}>提交反馈</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
    _reset () {
        this.refs.scrollView.scrollTo({y: 0});
    }
    _onFocus () {
        this.refs.scrollView.scrollTo({y: 200});
    }

    OnFeedback () {
        if (!this.state.title) {
            Loading.Toast('标题不能为空');
        } else if (!this.state.content) {
            Loading.Toast('问题和意见不能为空');
        } else if (Utils.isMobile(this.state.mobile) === 1) {
            Loading.Toast('手机号码不能为空')
        } else if (Utils.isMobile(this.state.mobile) === 2) {
            Loading.Toast('手机号码不正确');
        } else if (Utils.isEmail(this.state.email) === 1) {
            Loading.Toast('邮箱不能为空')
        } else if (Utils.isEmail(this.state.email) === 2) {
            Loading.Toast('邮箱不正确');
        } else {
            this.LoadGet();
        }
    }
    async LoadGet () {
        try {
            let Uid = await AsyncStorage.getItem('uId');
            let formData = new FormData();
            formData.append('uId', Uid);
            formData.append('mobile', this.state.mobile);
            formData.append('title', this.state.title);
            formData.append('email', this.state.email);
            formData.append('content', this.state.content);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/account/addFeedback', formData);
            if (Number(data.code) === 0) {
                Loading.Toast('提交成功');
            } else {
                Loading.Toast(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    // 返回
    onBackButton () {
        this.props.navigation.state.params.ReceiveCode()
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
    FeedbackMain: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    HelpFeedbackBott: {
        flex: 1,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'flex-end',
        paddingBottom: 50,
    },
    HelpFeedbackBottView: {
        backgroundColor: '#007BD0',
        height: 45,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    HelpFeedbackBottViewText: {
        color: '#fff',
        fontSize: Utils.setSpText(16)
    },
    FeedbackMainTitle: {
        paddingTop: 20,
        paddingBottom: 20,
        fontSize: Utils.setSpText(17),
        color: '#4D4D4D',
    },
    textInputs: {
        height: 40,
        fontSize: 14,
    },
    FeedbackMainTitleContent: {
        width: '100%',
        height: 200,
        fontSize: 14,
    }
});

