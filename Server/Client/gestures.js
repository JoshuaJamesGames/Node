//Hand events
			//Array for collision checking
			export const collideObjects = [];

            export function collideObject( indexTip ) {

				for ( let i = 0; i < collideObjects.length; i ++ ) {
					const touchable = collideObjects[ i ];
					const distance = indexTip.getWorldPosition( tmpVector1 ).distanceTo( touchable.getWorldPosition( tmpVector2 ) );
					if ( distance < touchable.geometry.boundingSphere.radius * touchable.scale.x ) {
						return touchable;
					}
				}
				return null;
			}
			
			export function onPinchStartRight( event ) {

				const controller = event.target;
				const indexTip = controller.joints[ 'index-finger-tip' ];
				const object = collideObject( indexTip );
				if ( object ) {

					grabbing = true;
					indexTip.attach( object );
					//object.material.emissive.b = 1;
					controller.userData.selected = object;
					//console.log( 'Selected', object );
					objectsToUpdate[object.uuid]={};
					//console.log(objectsToUpdate);

				}

			}

			export function onPinchEndRight( event ) {

				const controller = event.target;

				if ( controller.userData.selected !== undefined ) {

					const object = controller.userData.selected;
					//object.material.emissive.b = 0;
					scene.attach( object );
					delete objectsToUpdate[object.uuid];
					//console.log(objectsToUpdate);
					controller.userData.selected = undefined;
					grabbing = false;

				}

				scaling.active = false;

			}			
			
			export function onSqueezeStartRight( event ){
				const controller = event.target;
				const rightHand = scene.getObjectByProperty('name', socket.id+'rightHandWrist');
				rightHand.material.emissive.b = 1;				
				rightHandSqueeze.position.copy(scene.getObjectByProperty('name', 'hand2').joints.wrist.position);
				rightHandSqueeze.rotation.copy(scene.getObjectByProperty('name', 'hand2').joints.wrist.rotation);
				rightHandSqueeze.squeezing = true; 
				
				
			}

			export function onSqueezeEndRight( event ){
				const controller = event.target;
				const rightHand = scene.getObjectByProperty('name', socket.id+'rightHandWrist');
				rightHand.material.emissive.b = 0;
				rightHandSqueeze.squeezing = false;
				
				
			}

			export function onSqueezeStartLeft( event ){
				const controller = event.target;
				const leftHand = scene.getObjectByProperty('name', socket.id+'leftHandWrist');
				leftHand.material.emissive.b = 1;
				
				
			}

			export function onSqueezeEndLeft( event ){
				const controller = event.target;
				const leftHand = scene.getObjectByProperty('name', socket.id+'leftHandWrist');
				leftHand.material.emissive.b = 0;
				
				
			}