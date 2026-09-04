const applyPublicationGating = (query, userRole = 'VISITOR') => {
  if (['ADMIN', 'MODERATOR'].includes(userRole)) {
    return query;
  }
  return {
    ...query,
    'publication.publication_status': 'PUBLISHED',
  };
};

module.exports = { applyPublicationGating };
