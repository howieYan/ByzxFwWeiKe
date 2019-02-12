import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    WebView
} from 'react-native';
import Utils from "../../../Store/Utils";
import {SwRefreshScrollView} from 'react-native-swRefresh';
import {Loading} from "../../../Component/Loading";
export default class BookAcademy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
        }
    }
    componentDidMount () {
        this.LoadData()
    }
    async LoadData () {
        try {
            Loading.show('努力加载中...')
            let formData = new FormData();
            formData.append('artId', this.props.navigation.state.params.artId);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/artDetail', formData);
            if (Number(data.code) === 0) {
                this.setState({
                    data: data.result
                })
            }
            Loading.hidden();
        }
        catch (e) {
            console.log(e);
        }
    }
    _onRefresh(end){
        let _this = this;
        let timer =  setTimeout(()=>{
            clearTimeout(timer)
            // _this.loadData(); //调用接口
            end()//刷新成功后需要调用end结束刷新
        },1500)

    }
    render() {
        return (
            <View style={styles.content}>
                <ImageBackground source={{uri: this.state.data.art_thumb}} style={styles.BgImgImage}>
                    <View style={styles.messageHeader}>
                        <TouchableOpacity activeOpacity={0.8}
                                          navigator={this.props.navigator}
                                          onPress={this.onBackButton.bind(this)}>
                            <View style={styles.headerLeft}>
                                <Image
                                    style={styles.messageHeaderBack}
                                    source={require('../../../Image/Backfff.png')}
                                />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.8}>
                            <View style={styles.headerRight} >
                                <Text style={styles.headerRightText}>{}</Text>
                            </View>

                        </TouchableOpacity>
                    </View>
                </ImageBackground>
                <SwRefreshScrollView
                    onRefresh={this._onRefresh.bind(this)}
                    ref="scrollView">
                    <View style={styles.content}>
                        <View style={styles.BookDetailsHeader}>
                            <Image style={styles.BookDetailsHeaderUserImg} source={{uri: this.state.data.art_avatar}}/>
                            <View style={styles.BookDetailsHeaderUserTime}>
                                <Text style={styles.BookDetailsHeaderUserName}>北邮在线</Text>
                            </View>
                            <Text style={styles.BookDetailsHeaderUserTimeText}>{this.getTime(this.state.data.art_created)}小时前</Text>
                        </View>
                        <View style={styles.BookDetailsTitle}>
                            <Text style={styles.BookDetailsTitleText} >{this.state.data.art_title}</Text>
                        </View>
                        <View style={styles.BookDetailsConter}>
                            <WebView
                                originWhitelist={['*']}
                                setHorizontalScrollBarEnabled={false}
                                setVerticalScrollBarEnabled={false}
                                source={{html: this.state.data.art_content, baseUrl: ''}}
                                bounces={false}
                                scalesPageToFit={Utils.size.os === 'ios' ? false : true}
                                style={{width: Utils.size.width,height: 400}}>
                            </WebView>
                        </View>
                    </View>
                </SwRefreshScrollView>
            </View>
        );
    }

    //计算时间
    getTime (record) {
        let time = new Date();
        let data = time.getTime();
        data = JSON.stringify(data).substring(0, 10);
        data = data - record;
        data = Utils.formatTs (data, 'HH');
        let timeData = data.substring(0, 1);
        if (Number(timeData) === 0) {
            data = data.replace('0', '');
        }
        return data;
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
    BgImgImage: {
        width: Utils.size.width,
        height: 240,
    },
    messageHeader: {
        height: (Utils.size.os === 'ios') ? 74 : 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: ( Utils.size.os === 'ios') ? 30 : 20,
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
    },
    // 内容
    BookDetailsHeader: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    BookDetailsHeaderUserImg: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    BookDetailsHeaderUserName: {
        fontSize: Utils.setSpText(16),
        color: '#585858',
        paddingLeft: 10,
    },
    BookDetailsHeaderUserTime: {
        flex: 1,
    },
    BookDetailsHeaderUserTimeText: {
        color: '#B3B3B3',
        fontSize: Utils.setSpText(13),
    },
    BookDetailsTitle: {
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomColor: '#EAEAEA',
        borderBottomWidth: 1,
    },
    BookDetailsTitleText: {
        paddingLeft: 10,
        paddingRight: 10,
        color: '#000000',
        fontSize: Utils.setSpText(17),
    },
    BookDetailsConter: {
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
    }

});

