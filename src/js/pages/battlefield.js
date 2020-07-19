import React from 'react';
import { connect } from 'react-redux';
import { battlePartnerSelector } from '../reducers/battlefield';
import { push } from '../utils/common';

const Battlefield = ({ partner }) => {
  if (!partner) {
    push('/lobby');
  }
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
