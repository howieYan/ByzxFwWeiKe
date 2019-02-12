import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    TouchableOpacity,
    Animated,
    AsyncStorage,
} from 'react-native';
import {
    SwRefreshScrollView,
    SwRefreshListView,
    RefreshStatus,
    LoadMoreStatus
} from 'react-native-swRefresh'
import Utils from "../../Store/Utils";
import {Loading} from "../../Component/Loading";

export default class MyVip extends Component {
    _page = 1;
    _dataSourceList = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});

    constructor(props) {
        super(props);
        this.state = {
            size: 10,
            list: [],
            total: null,
            dataSource: this._dataSourceList.cloneWithRows([
                {
                    u_avatar: "https://bywk360.cn/uploads/avatar/352799270690845397.png",
                    u_nickname: '北邮在线',
                    u_reg_time: "2018-12-20 14:24:22"
                },
            ]),
        };
    }

    componentDidMount() {
        Loading.show('努力加载中...')
        let timer = setTimeout(() => {
            clearTimeout(timer);
            if (this.refs.listView) {
                this.refs.listView.beginRefresh()
            }
        }, 200)
    }

    async LoadData() {
        try {
            let Uid = await AsyncStorage.getItem('uId');
            let formData = new FormData();
            formData.append('page', this._page);
            formData.append('size', this.state.size);
            formData.append('uId', Uid);
            let data = await Utils.LoadPost(Utils.size.url + 'v1/account/getMembers', formData);
            console.log(data)
            if (Number(data.code) === 0) {
                this.setState({
                    dataSource: this._dataSourceList.cloneWithRows(data.result.list),
                    list: data.result.list,
                    total: data.result.total,
                })
                if (Number(data.result.total) >= 10) {
                    this.setState({
                        isBottomMode: true,
                    })
                }
            } else {
                Loading.Toast(data.message);
            }
            Loading.hidden();
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <View style={[styles.content]}>
                <View style={styles.messageHeader}>
                    <TouchableOpacity activeOpacity={0.8}
                                      navigator={this.props.navigator}
                                      onPress={this.onBackButton.bind(this)}>
                        <View style={styles.headerLeft}>
                            <Image
                                style={styles.messageHeaderBack}
                                source={require('../../Image/Back.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <Animated.Text numberOfLines={1}
                                   style={[styles.messageHeaderTitle]}>{this.props.navigation.state.params.name}</Animated.Text>
                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={styles.headerRight}>
                            <Text style={styles.headerRightText}>{}</Text>
                        </View>

                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    {this._renderListView()}

                </View>
            </View>
        )

    }

    _renderListView() {
        return (
            <SwRefreshListView
                dataSource={this.state.dataSource}
                ref="listView"
                renderRow={this._renderRow.bind(this)}
                onRefresh={this._onListRefersh.bind(this)}
                onLoadMore={this._onLoadMore.bind(this)}
                isShowLoadMore={this.state.isBottomMode}
            />
        )

    }

    _renderRow(rowData) {
        return (
            <View style={styles.ItemsRow}>
                <Image style={styles.ItemsRowImg}
                       source={rowData.u_avatar === '' ? require('../../Image/My/UserActive.png') : {uri: this.getUrl(rowData.u_avatar)}}/>
                <Text style={styles.ItemsText} numberOfLines={1}>{rowData.u_nickname}</Text>
                <Text style={styles.ItemsTime}>{rowData.u_reg_time}</Text>
            </View>
        )

    }
    getUrl (record) {
        record = record.toString()
        if (record.indexOf("https") !== -1) {
            return record
        } else {
            return record.replace('http', 'https')
        }


    }
    _onListRefersh(end) {
        let timer = setTimeout(() => {
            clearTimeout(timer)
            this._page = 1;
            this.LoadData();
            if (this.refs.listView) {
                this.refs.listView.resetStatus()
            }
            end()//刷新成功后需要调用end结束刷新
        }, 1000)
    }

    _onLoadMore(end) {
        let timer = setTimeout(() => {
            clearTimeout(timer)
            this._page++;
            this.LoadDataFoot();
        }, 1000)
    }

    async LoadDataFoot() {
        try {
            let Uid = await AsyncStorage.getItem('uId');
            let formData = new FormData();
            formData.append('page', this._page);
            formData.append('size', this.state.size);
            formData.append('uId', Uid);
            let data = await Utils.LoadPost(Utils.size.url + 'v1/account/getMembers', formData);
            if (Number(data.code === 0)) {
                if (this.state.total >= 10) {
                    this.setState({
                        list: [...this.state.list, ...data.result.list],
                        dataSource: this._dataSourceList.cloneWithRows([...this.state.list, ...data.result.list]),
                        isBottomMode: true,
                    })
                    this.refs.listView.endLoadMore(Number(this.state.list) >= Number(this.state.total))
                } else {
                    this.setState({
                        isBottomMode: false,
                    })
                }
            } else {
                Loading.Toast(data.message);
            }
        } catch (e) {
            console.log(e);
        }
    }

    onBackButton(record) {
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
        borderBottomColor: '#F1F1F1',
        paddingTop: (Utils.size.os === 'ios') ? 30 : 0,
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
        flexDirection: 'row-reverse',
    },
    BookMain: {
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    BookMainHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    BookMainHeaderUserIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    BookMainHeaderUserName: {
        flex: 1,
    },
    BookMainHeaderUserNameText: {
        paddingLeft: 10,
        fontSize: Utils.setSpText(16),
        fontWeight: 'bold',
        color: '#252525',
    },
    BookMainHeaderTime: {
        fontSize: Utils.setSpText(12),
        color: '#A5A5A5',
    },
    BookMainImg: {
        marginTop: 10,
        borderRadius: 5,
        width: Utils.size.width - 20,
        height: 200,
    },
    BookMainTitle: {
        fontSize: Utils.setSpText(14),
        color: '#393939',
        paddingTop: 10,
        paddingBottom: 10,
    },
    ItemsRow: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F1F1',
    },
    ItemsRowImg: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    ItemsText: {
        paddingLeft: 10,
        flex: 1,
        fontSize: Utils.setSpText(18),
        color: '#000',
    },
    ItemsTime: {
        fontSize: Utils.setSpText(16),
        color: '#393939',
    }
})
