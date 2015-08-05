require 'json'

class Enumerator
  def to_json
    '[' << each.with_object('') do |e, s|
      s << "#{s.empty? ? '' : ','}" << e.to_json
    end << ']'
  end
end
