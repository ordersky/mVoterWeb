// TODO: Refactor this component to be able to use as a reusable collapse in the future
import { useEffect, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import Collapsible from 'react-collapsible';
import Modal from '../Common/Modal/Modal';

import './locationCollapse.scss';

const TownshipModal = (props) => {
  const {
    isModalOpen,
    setModalOpen,
    onClickTownship,
  } = props;
  const [stateRegions, setStateRegions] = useState([]);
  const [townships, setTownships] = useState([]);
  const [isTownshipsLoading, setTownshipsLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      fetchStateRegions();
    }
  }, [isModalOpen]);

  async function fetchStateRegions() {
    const response = await fetch(`/api/locations?type=state_regions`);
    const result = await response.json();

    setStateRegions(result.data);
  }

  async function fetchTownships(stateRegion) {
    // Use cached values if it is already loaded
    const townshipsLoaded = townships.findIndex(({ stateRegion: sr }) => sr === stateRegion) > -1;

    if (townshipsLoaded) return;

    const response = await fetch(`/api/locations?type=townships&state_region=${stateRegion}`);
    const result = await response.json();

    const clonedTownships = [...townships];

    clonedTownships.push({
      stateRegion,
      townships: result.data,
    });

    setTownships(clonedTownships);
  }

  async function onChangeAccordion(accordionId) {
    // This is a BAD practice, but it should suffice
    const textNode = document.getElementById(`accordion__heading-${accordionId}`).textContent;
    await fetchTownships(textNode);
  }

  function renderTownships(stateRegion) {
    const containedTownships = townships.find(({ stateRegion: sr }) => sr === stateRegion);

    if (containedTownships) {
      return (
        containedTownships.townships.map((township) => (
          <div
            key={township}
            className="location-child"
            onClick={() => onClickTownship(stateRegion, township)}
          >
              {township}
            </div>
        ))
      )
    } else {
      return <AiOutlineLoading className="loader" />;
    }
  }

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setModalOpen(false)}
    >
      <div className="text-center text-bold">မြို့နယ်ရွေးပါ</div>
      {
        stateRegions.map((stateRegion, srIndex) => (
          <Collapsible
            key={srIndex}
            transitionTime={200}
            trigger={stateRegion}
            onOpen={() => fetchTownships(stateRegion)}>
              {renderTownships(stateRegion)}
          </Collapsible>
        ))
      }
    </Modal>
  );
};

export default TownshipModal;