import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    TextInput,
    ScrollView,
    ImageBackground,
    AsyncStorage
} from 'react-native';
import Utils from "../../../Store/Utils";
// import ImageBrowsing from '../../../Component/ImageBrowsing';
import {Loading} from "../../../Component/Loading";
import ImagePicker  from 'react-native-image-picker';
import AlertView from "../../../Component/Alert";
export default class PublishedAnswer extends React.Component {
    ListImg = [];
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            index: 0,
            isShow: false,
            Array : [
                // {url: 'http://carpics.img-cn-shanghai.aliyuncs.com/2017-07-27/1501119379091pjwjix.jpg@!568_394'},
                // {url: 'http://carpics.img-cn-shanghai.aliyuncs.com/2017-07-27/1501119134909gznrjz.jpg@!568_394'},
                // {url: 'http://carpics.img-cn-shanghai.aliyuncs.com/2017-07-27/15011191973067e5qzp.jpg@!568_394'},
                // {url: 'http://carpics.img-cn-shanghai.aliyuncs.com/2017-07-27/1501119078312c820kf.jpg@!568_394'}
            ],
            alertData: {
                leftName: '',
                rightName: '',
                centerName: '',
                alertTitle: '',
                alertContent: '',
                leftClick: null,
                rightClick: null,
                centerClick: null,
            }
        };

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
                    <TouchableOpacity activeOpacity={0.8} onPress={this.onSumbile.bind(this)}>
                        <View style={styles.headerRight}>
                            <Text style={styles.headerRightText}>确定</Text>
                        </View>

                    </TouchableOpacity>
                </View>
                <ScrollView
                    scrollEnabled={false}     //防止滑动
                    contentContainerStyle={{flex:1}}
                    ref="scrollView">
                    <View style={[styles.content, {height: Utils.size.height}]}>
                        <View style={styles.LoginHeader}>
                            <View style={styles.LoginInput}>
                                <View style={styles.LoginInputRight}>
                                   <Text style={{color: '#000000',fontSize: Utils.setSpText(18)}}>{this.props.navigation.state.params.data.q_title}</Text>
                                </View>
                            </View>
                            <View style={styles.LoginInputRight}>
                                <TextInput
                                    onBlur={this._reset.bind(this)}
                                    onFocus={this._onFocus.bind(this, 'textInput')}
                                    multiline = {true}
                                    textAlignVertical= 'top'
                                    underlineColorAndroid="transparent"
                                    numberOfLines = {4}
                                    style={{width: '100%', height: 100, fontSize: 14}}
                                    onChangeText={(text) => this.setState({content: text})}
                                    value={this.state.content}
                                    placeholder={'请输入您回答的内容'}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <View style={this.state.isShow ? styles.PublishedAnswerBott : styles.PublishedAnswerBottBg }>
                            <View style={styles.PublishedAnswerImage}>
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    automaticallyAdjustContentInsets={false}
                                >
                                    {this.renderList()}
                                </ScrollView>
                            </View>
                            <View style={styles.PublishedAnswerStyle}>
                                <TouchableOpacity activeOpacity={0.8} onPress={this._imagePicker.bind(this)}>
                                    <Image style={styles.PublishedAnswerStyleIcon} source={require('../../../Image/Photo.png')}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                {this._renderAndroidAlert()}
            </View>
        );
    }
    // 弹窗
    _renderAndroidAlert() {
        return(
            <AlertView ref='alert'
                       leftName={this.state.alertData.leftName}
                       rightName={this.state.alertData.rightName}
                       centerName={this.state.alertData.centerName}
                       alertTitle={this.state.alertData.alertTitle}
                       alertContent={this.state.alertData.alertContent}
                       leftClick={this.state.alertData.leftClick}
                       rightClick={this.state.alertData.rightClick}
                       centerClick={this.state.alertData.centerClick}
            />
        );

    }
    // 确定提交
    onSumbile () {
        if (!this.state.content) {
            Loading.Toast('回答的内容不能为空');
        } else {
            this.LoadData()
        }
    }
    // 发布问提的接口
    async LoadData () {
        try {
            let formData = new FormData();
            let Uid = await AsyncStorage.getItem('uId');
            formData.append('uId', Uid);
            formData.append('qId', this.props.navigation.state.params.data.q_id);
            if (this.props.navigation.state.params.iskey) {
                formData.append('qaKey', this.props.navigation.state.params.data.qa_key);
            }
            formData.append('title', this.props.navigation.state.params.data.q_title);
            formData.append('content', this.state.content);
            formData.append('attachment', JSON.stringify(this.ListImg));
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/questionReply', formData);
            if (Number(data.code) === 0) {
                Loading.Toast('回答成功');
                Loading.hidden();
                this.onBackButton();
            } else {
                Loading.Toast(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    // 打开modal
    _imagePicker() {
        const options = {
            //底部弹出框选项
            title: '选择图片',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择照片',
            cameraType: 'back',
            mediaType: 'photo',
            videoQuality: 'high',
            durationLimit: 10,
            maxWidth: 200,
            maxHeight: 200,
            quality: 0.8,
            angle: 0,
            allowsEditing: false,
            noData: false,
            storageOptions: {
                skipBackup: true,
                cameraRoll: true,
            }
        }

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let file;
                if(Utils.size.OS === 'android'){
                    file = response.uri
                }else {
                    file = response.uri.replace('file://', '')
                }
                this._fetchImage(response, file);
            }
        });
    }
    // 上传图片
    async _fetchImage (response, record) {
        try {
            let data = await Utils.uploadImage(record, record, 'question');
            if (Number(data.code) === 0) {
                this.ListImg.push({'url': data.result.url});
                Loading.Toast('图片添加成功');
                this.forceUpdate()
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
        this.props.navigation.state.params.BackLoad();
        this.props.navigation.goBack();
    }
    _reset () {
        this.refs.scrollView.scrollTo({y: 0});
        this.setState({
            isShow: false,
        })
    }
    _onFocus () {
        this.refs.scrollView.scrollTo({y: 50});
        this.setState({
            isShow: true,
        })
    }
    renderList () {
        let List = [];
        if (this.ListImg.length > 0) {
            this.ListImg.forEach((v, i) => {
                List.push(
                    <View style={{paddingRight: 10, height:80, alignItems: 'center',justifyContent: 'center'}} key={i}>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.OnPhoto.bind(this, i)}>
                            <ImageBackground style={{width: 80,height: 60}} source={{uri: v.url}}>
                                <TouchableOpacity activeOpacity={0.8} onPress={this.OnClose.bind(this, i)}>
                                    <Image style={{width: 15, height: 15, position: 'absolute', right: -7, top: -7}} source={require('../../../Image/close.png')}/>
                                </TouchableOpacity>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                )
            })
        } else {
            List.push(
                <Text key={this.state.index}/>
            )
        }
        return List;
    }
    OnPhoto (record) {
        // alert('图片查看详情')
        // this.props.navigator.push({
        //     component: ImageBrowsing,
        //     params: {
        //         name: '图片查看详情',
        //         data: this.state.Array,
        //         index: record
        //     }
        // })
    }
    OnClose (index) {
        this.setState({
            alertData: {
                leftName: '确定',
                rightName: '取消',
                alertTitle: '提示',
                alertContent: '您是否要删除？',
                leftClick: this.close.bind(this, index),
                rightClick: this.rightClick.bind(this),
            }
        })
        this.refs.alert && this.refs.alert.showDialog();

    }
    // 取消弹窗
    rightClick = () => {
        this.refs.alert && this.refs.alert.hideAlertView();
    }
    close (index) {
        this.ListImg.splice(index, 1);
        this.forceUpdate();
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
        borderBottomColor: '#F0F0F0',
        borderBottomWidth: 1,
        paddingTop: ( Utils.size.os === 'ios') ? 30 : 0,
        backgroundColor: '#fff',
    },
    messageHeaderTitle: {
        color: '#101010',
        fontWeight: 'bold',
        fontSize: Utils.setSpText(17),
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
    // 内容
    LoginHeader: {
        // alignItems: 'center',
        justifyContent: 'center',
    },
    LoginHeaderIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    LoginInput: {
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#EBEBEB',
        borderBottomWidth: 1,
    },
    LoginInputUser: {
        width: 28,
        height: 28,
    },
    LoginInputUserPwd: {
        width: 28,
        height: 28,
    },
    LoginInputRight: {
        paddingLeft: 10,
        flex: 1,
    },
    PublishedAnswerBott: {
        justifyContent: 'flex-end',
    },
    PublishedAnswerBottBg: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    PublishedAnswerStyle: {
        flexDirection: 'row',
        height: 50,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomColor: '#EDECED',
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    PublishedAnswerStyleLeft: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,borderColor: '#EDECED',borderWidth: 1,borderRadius: 2,
    },
    PublishedAnswerStyleIcon: {
        width: 35,
        height: 30,
    },
    PublishedAnswerImage: {
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row'
    }
});

