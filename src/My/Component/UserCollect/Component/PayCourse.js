import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    AsyncStorage
} from 'react-native';
import Utils from "../../../../Store/Utils";
import {Loading} from "../../../../Component/Loading";
export default class PayCourse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPay: 1,
            page: 1,
            size: 20,
            data: [],
        };

    }
    componentDidMount () {
        this.LoadData()
    }
    async LoadData () {
        try {
            let Uid = await AsyncStorage.getItem('uId');
            let formData = new FormData();
            formData.append('uId', Uid);
            formData.append('page', this.state.page);
            formData.append('size', this.state.size);
            formData.append('isPay', this.state.isPay);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/account/collection', formData);
            if (Number(data.code) === 0) {
                this.setState({
                    total: data.result.total,
                    data: data.result.list,
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
                <ScrollView>
                    <View style={styles.VideoNav}>
                        {this.renderList()}
                    </View>
                </ScrollView>
            </View>
        );
    }
    renderList () {
        let Total = this.state.data.length;
        let List = [];
        if (Total > 0) {
            this.state.data.forEach((v, i) => {
                List.push(
                    <TouchableOpacity key={i} activeOpacity={0.5} onPress={this.onBookButton.bind(this, v)}>
                        <View style={[styles.VideoNavLeft, { paddingTop: 10}]}>
                            <View style={i % 2 === 0 ? styles.VideoNavPadd: styles.VideoNavPaddRight}>
                                <Image source={{uri: v.pg_thumb}} style={styles.VideoNavLeftImg}/>
                                <Text style={styles.VideoNavLeftText} numberOfLines={1}>{v.pg_title}</Text>
                                <View style={styles.VideoNavTextState}>
                                    <Text style={styles.VideoNavLeftMoney}>¥ {v.pg_price}</Text>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.VideoNavLeftTime} numberOfLines={1}>人已学{v.pg_sales}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            });
        } else {
            List.push(
                <View style={{flex: 1, width: Utils.size.width, height: 400,alignItems: 'center',justifyContent: 'center'}} key={Total}>
                    <Text>没有数据</Text>
                </View>
            )
        }
        return List;
    }
    onBookButton (record) {
        this.props.navigation.navigate('VideoList', {name: record.pg_title, pgId: record.pg_id, type: 1})
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    VideoNav: {
        marginTop: 20,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    VideoNavLeft: {
        width: Utils.size.width / 2,
        // alignItems: 'center',
        justifyContent: 'center',
    },
    VideoNavPadd: {
        paddingLeft: 10,
        paddingRight: 5
    },
    VideoNavPaddRight: {
        paddingLeft: 5,
        paddingRight: 10
    },
    VideoNavLeftImg: {
        width: '100%',
       borderRadius: 3,
       height: 100
    },
    VideoNavLeftText: {
        paddingTop: 10,
        fontSize: Utils.setSpText(16),
        color: '#000',
    },
    VideoNavTextState: {
        width: Utils.size.width / 2 - 15,
        paddingTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    VideoNavLeftMoney: {
        fontSize: Utils.setSpText(14),
        color: '#FF0000',
    },
    VideoNavLeftTime: {
        paddingLeft: 10,
        color: '#a7a7a7',
        fontSize: Utils.setSpText(12)
    }
});

