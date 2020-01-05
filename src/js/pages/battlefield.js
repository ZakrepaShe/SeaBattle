import React from 'react';
import { connect } from 'react-redux';
import { battlePartnerSelector } from '../reducers/battlefield';

const Battlefield = ({ partner }) => {
  return (
    <>
      <div className="name-display">{partner}</div>
    </>
  );
};

const mapStateToProps = state => ({
  partner: battlePartnerSelector(state)
});

export default connect(mapStateToProps)(Battlefield);
