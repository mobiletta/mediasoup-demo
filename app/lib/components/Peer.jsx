import React from 'react';
import { connect } from 'react-redux';
import * as appPropTypes from './appPropTypes';
import PeerInfo from './PeerInfo';
import Stream from './Stream';

const Peer = (props) =>
{
	const {
		peer,
		micConsumer,
		webcamConsumer
	} = props;

	const micEnabled = (
		Boolean(micConsumer) &&
		!micConsumer.locallyPaused &&
		!micConsumer.remotelyPaused
	);

	const videoVisible = (
		Boolean(webcamConsumer) &&
		!webcamConsumer.locallyPaused &&
		!webcamConsumer.remotelyPaused
	);

	return (
		<div data-component='Peer'>
			<div className='indicators'>
				{!micEnabled ?
					<div className='icon mic-off' />
					:null
				}
				{!videoVisible ?
					<div className='icon webcam-off' />
					:null
				}
			</div>

			{videoVisible && !webcamConsumer.supported ?
				<div className='incompatible-video'>
					<p>incompatible video</p>
				</div>
				:null
			}

			<PeerInfo
				peer={peer}
			/>

			<Stream
				audioTrack={micConsumer ? micConsumer.track : null}
				videoTrack={webcamConsumer ? webcamConsumer.track : null}
				visible={videoVisible}
			/>
		</div>
	);
};

Peer.propTypes =
{
	peer           : appPropTypes.Peer.isRequired,
	micConsumer    : appPropTypes.Consumer,
	webcamConsumer : appPropTypes.Consumer
};

const mapStateToProps = (state, { name }) =>
{
	const peer = state.peers[name];
	const consumersArray = peer.consumers
		.map((consumerId) => state.consumers[consumerId]);
	const micConsumer =
		consumersArray.find((consumer) => consumer.source === 'mic');
	const webcamConsumer =
		consumersArray.find((consumer) => consumer.source === 'webcam');

	return {
		peer,
		micConsumer,
		webcamConsumer
	};
};

const PeerContainer = connect(mapStateToProps)(Peer);

export default PeerContainer;
